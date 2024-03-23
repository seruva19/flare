import importlib
import os
import sys
from fastapi import FastAPI

from flare_server.model import FlareEnvironment, FlareRequest
from flare_server.processor import processRequest


def find_plugins_pyfiles(directory):
    pyfiles_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file == "start.py":
                pyfiles_files.append(os.path.join(root, file))
    return pyfiles_files


class FlareServer:
    modules = {}
    environment: FlareEnvironment = None

    def __init__(self, app: FastAPI):
        self.environment = FlareEnvironment()
        self.environment.load()

    def register_plugin_operations(self, pypath):
        plugin_path = os.path.dirname(pypath)
        sys.path.append(plugin_path)

        plugin_name = os.path.basename(plugin_path)

        spec = importlib.util.spec_from_file_location(plugin_name, pypath)

        if spec is not None:
            module = importlib.util.module_from_spec(spec)
            sys.modules[plugin_name] = module
            if spec.loader is not None:
                spec.loader.exec_module(module)

                if hasattr(module, "register") and callable(
                    getattr(module, "register")
                ):
                    self.modules.update(module.register())
                    print(f"flare: plugin '{plugin_name}' successfully registered")
                else:
                    print(
                        f"flare: plugin '{plugin_name}' does not have a register function"
                    )
        else:
            print(f"flare: plugin '{plugin_name}' failed to register")

    def register_all_plugins(self):
        print("flare: registering plugins")

        pyfiles = find_plugins_pyfiles("plugins")
        for pyfile in pyfiles:
            self.register_plugin_operations(pyfile)

    def get_environment_info(self) -> FlareEnvironment:
        for module, modules_dict in self.modules.items():
            self.environment.modules[module] = list(modules_dict.keys())

        return self.environment.to_json()

    def route(self, request: FlareRequest):
        response = processRequest(self.modules, request, self.environment)
        return response
