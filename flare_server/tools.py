import gc
import os
import uuid
import cv2
import toml
import torch


class FlareTools:
    def load_settings(self, settings_file):
        with open(settings_file, "r") as toml_file:
            settings = toml.load(toml_file)
        return settings

    def save_settings(self, settings_file, settings):
        with open(settings_file, "w") as toml_file:
            toml.dump(settings, toml_file)

    def save_image(self, image, name=None, output_dir="build/images", nd_arr=False):
        filename = f"{str(uuid.uuid4())}.png" if name is None else name

        os.makedirs(output_dir, exist_ok=True)
        image_path = os.path.join(output_dir, filename)
        if nd_arr:
            cv2.imwrite(image_path, image)
        else:
            image.save(image_path)

        return filename

    def unload_model(self, model):
        if model is not None:
            model.to("cpu")
            if torch.cuda.is_available():
                with torch.cuda.device("cuda"):
                    torch.cuda.empty_cache()
                    torch.cuda.ipc_collect()
            gc.collect()
