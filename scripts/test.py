from flare_server.model import llm_json_to_flare_task


def run():
    import unittest
    from plugins.flare_phi2.start import FlarePhi2

    flare_phi2 = FlarePhi2()
    tests = {"total": 0, "passed": 0}

    initial_prompt = "beautiful girl on the summer beach under amazing sun"
    requests = [
        {"request": "", "prompt": initial_prompt, "await": "draw"},
        {"request": initial_prompt, "prompt": "remove girl", "await": "remove"},
        {"request": initial_prompt, "prompt": "add rainy clouds", "await": "draw"},
        {"request": initial_prompt, "prompt": "upscale by 2", "await": "upscale"},
        {
            "request": initial_prompt,
            "prompt": "resize to 768 wide and 840 tall",
            "await": "resize",
        },
        {"request": initial_prompt, "prompt": "undo", "await": "undo"},
        {"request": initial_prompt, "prompt": "remove sun", "await": "remove"},
        {
            "request": initial_prompt,
            "prompt": "replace girl with boy",
            "await": "replace",
        },
        {
            "request": initial_prompt,
            "prompt": "replace sun with birds",
            "await": "replace",
        },
        {"request": initial_prompt, "prompt": "add horrifying dragon", "await": "draw"},
        {"request": initial_prompt, "prompt": "try again", "await": "retry"},
        {"request": initial_prompt, "prompt": "add boy", "await": "draw"},
    ]

    for req in requests:
        params = {
            "prompt": req["prompt"],
            "last_prompt": req["request"],
            "settings": {"offload_models": False},
        }
        response = {}

        flare_phi2.text_to_task(params, response)
        params["task"] = llm_json_to_flare_task(response["json_task"])
        flare_phi2.modify_prompt(params, response)

        print(req["prompt"])
        print(response["json_task"])
        print(response["outPrompt"])

        tests["total"] += 1
        try:
            assert response["json_task"]["task"] == req["await"]
            tests["passed"] += 1
            print("🆗")
        except:
            print("⭕")

    if tests["total"] == tests["passed"]:
        print(f"✅ all {tests['total']} tests passed")
    else:
        print(
            f"❌ failed {tests['total'] - tests['passed']} out of {tests['total']} tests"
        )
