from typing import Dict
from openai import BaseModel
from enum import Enum

from flare_server.tools import FlareTools

settings_file = "config/flare.toml"


class FlareEnvironment:
    tools = FlareTools()

    modules = {}
    settings = {}

    def load(self):
        self.settings = self.tools.load_settings(settings_file)
        print(f"flare: settings read from {settings_file}")

    def to_json(self):
        return {"modules": self.modules, "settings": self.settings}


class FlareRequest(BaseModel):
    prompt: str
    lastPrompt: str
    lastImage: str
    settings: Dict[str, str | bool]
    ops: Dict[str, str]


class FlareOperations(Enum):
    TEXT_TO_IMAGE = "text-to-image"
    INPAINT = "inpaint"
    EXTRACT_MASK = "extract-mask"
    EXTRACT_BBOX_MASK = "extract-bbox-mask"
    PROMPT_TO_OP = "prompt-to-op"
    MODIFY_PROMPT = "modify-prompt"
    REMOVE_OBJECT = "remove-object"


class FlareTaskType(Enum):
    DRAW = "draw"
    REMOVE = "remove"
    REPLACE = "replace"
    UNDO = "undo"
    RETRY = "retry"
    UPSCALE = "upscale"
    RESIZE = "resize"


FlarePipelines = {
    "draw": [
        FlareOperations.MODIFY_PROMPT.value,
        FlareOperations.TEXT_TO_IMAGE.value,
    ],
    "replace": [
        FlareOperations.MODIFY_PROMPT.value,
        FlareOperations.EXTRACT_BBOX_MASK.value,
        FlareOperations.INPAINT.value,
    ],
    "remove": [
        FlareOperations.MODIFY_PROMPT.value,
        FlareOperations.EXTRACT_BBOX_MASK.value,
        FlareOperations.REMOVE_OBJECT.value,
    ],
}


class FlareTask:
    def __init__(self, task=None, source=None, target=None, size=None, factor=None):
        self.task: str = task
        self.source: str = source
        self.target: str = target
        self.size: str = size
        self.factor: str = factor


def llm_json_to_flare_task(json_data):
    return FlareTask(**json_data)
