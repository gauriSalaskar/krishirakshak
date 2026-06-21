"""
KrishiRakshak AI - EfficientNetB0 Training Script
Run this in Google Colab with GPU runtime for best results.
Dataset: PlantVillage from Kaggle
"""
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# Config
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
DATASET_PATH = "./PlantVillage"  # Path after extracting Kaggle dataset
MODEL_SAVE_PATH = "./model.keras"

def build_model(num_classes: int) -> Model:
    base = EfficientNetB0(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    # Freeze base layers initially
    base.trainable = False

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    return Model(inputs, outputs)

def train():
    # Data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        validation_split=0.2
    )

    train_gen = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training"
    )

    val_gen = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation"
    )

    num_classes = len(train_gen.class_indices)
    print(f"Found {num_classes} classes: {list(train_gen.class_indices.keys())}")

    # Save class names
    import json
    with open("class_names.json", "w") as f:
        json.dump(list(train_gen.class_indices.keys()), f)
    print("Saved class_names.json")

    model = build_model(num_classes)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    # Phase 1: Train top layers only
    print("Phase 1: Training top layers...")
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3),
        tf.keras.callbacks.ModelCheckpoint(MODEL_SAVE_PATH, save_best_only=True)
    ]

    model.fit(train_gen, validation_data=val_gen, epochs=10, callbacks=callbacks)

    # Phase 2: Fine-tune entire model
    print("Phase 2: Fine-tuning...")
    model.layers[1].trainable = True  # Unfreeze EfficientNet
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS, callbacks=callbacks)

    print(f"Training complete! Model saved to {MODEL_SAVE_PATH}")
    return model

if __name__ == "__main__":
    train()
