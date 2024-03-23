import traceback
from flare_server.model import (
    FlareEnvironment,
    FlareOperations,
    FlarePipelines,
    FlareRequest,
    FlareTaskType,
    llm_json_to_flare_task,
)


def processRequest(modules, request: FlareRequest, environment: FlareEnvironment):
    print(f"flare: received request {request}")

    response = {}
    params = {
        "prompt": request.prompt,
        "settings": request.settings,
        "last_prompt": request.lastPrompt,
        "input_image": request.lastImage,
        "tools": environment.tools,
    }

    try:
        lang_model_id = request.ops[FlareOperations.PROMPT_TO_OP.value]
        print(f"flare: requesting llm '{lang_model_id}' for prompt comprehension")

        lang_model = modules[lang_model_id]
        lang_model_action = lang_model[FlareOperations.PROMPT_TO_OP.value]
        lang_model_action(params, response)

        json_task = response["json_task"]
        flare_task = llm_json_to_flare_task(json_task)
        params["task"] = flare_task

        if flare_task.task not in FlarePipelines:
            f"flare: task '{flare_task.task}' cannot be processed, setting task to '{FlareTaskType.DRAW.value}'"
            flare_task.task = FlareTaskType.DRAW.value

        pipelines = FlarePipelines[flare_task.task]
        print(
            f"flare: task '{flare_task.task}' requires pipelines '{str.join(',', pipelines)}'"
        )

        for pipeline in pipelines:
            module_id = request.ops[pipeline]
            module = modules[module_id]

            print(f"flare: requesting module '{module_id}' for executing '{pipeline}'")

            module_action = module[pipeline]
            module_action(params, response)

    except Exception as e:
        print(f"flare: error detected ({e.with_traceback})")
        traceback.print_exc()
        response["error"] = str(e)

    return response
