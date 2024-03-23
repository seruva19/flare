# Flare

## Warning

EARLY PROTOTYPE, WORK IN PROGRESS :sleeping:

## Concept

The initial idea was to replicate DALL-E 3's chat-like iterative drawing pipeline.  
While drawing inspiration from Anything projects such as [Inpaint Anything](https://github.com/geekyutao/Inpaint-Anything), [IEA](https://github.com/feizc/IEA), [Segment Anything for Stable Diffusion WebUI](https://github.com/continue-revolution/sd-webui-segment-anything), [Grounded-Segment-Anything](https://github.com/IDEA-Research/Grounded-Segment-Anything), [Edit Anything](https://github.com/sail-sg/EditAnything) and [other](https://github.com/VainF/Awesome-Anything), the core concept is different: creating an application for <b>pure text-guided sequential image editing</b> similar to DALL-E 3. This involves further enriching it with features it lacked, such as pixel-perfect inpainting, object removal, etc.

## Features

:ballot_box_with_check: Text-to-image  
:ballot_box_with_check: Text-guided inpainting  
:ballot_box_with_check: Text-guided object removal  
:hourglass: Text-guided image resize  
:hourglass: Text-guided object injection  
:hourglass: Text-guided style transfer  
:hourglass: Text-guided outpainting  
:hourglass: Text-guided upscaling  
:hourglass: Image-based inpainting   
:hourglass: Text-guided image merge  
:hourglass: Text-guided object editing  
:hourglass: Text-guided composition control  
:hourglass: Text-guided object extraction  
:hourglass: Voice recognition  
:hourglass: Fine-tuning LLM for enhanced prompt comprehension  

## Example

![img](/screenshots/flare.png)


## Install

You need to have [Git (2.43)](https://git-scm.com/), [Python (3.10)](https://www.python.org/), [Poetry (1.7)](https://python-poetry.org/), [Node.js (21.6)](https://nodejs.org/) installed, then:
```
git clone https://github.com/seruva19/flare
cd flare

poetry run get-default-plugins
poetry run merge
poetry install

npm run build
```

## Launch

```
poetry run flare
```
And open browser at http://localhost:8000/

## FAQ

❓ What are system requirements?   
👉 I'm not sure, it has only been tested on an RTX 3090. Although there is an `Offload models after use` option in `Settings` tab, enabling which may help to decrease VRAM consumption.

❓ Does it only support SDXL base model?  
👉 Yes, for now. Once (if?) SD3 is released, I will migrate to it as soon as I can. 

❓ Can prompt comprehension be improved?  
👉 Currently, Flare utilizes in-context learning for the vanilla Phi-2 model. While this model is quite capable, its capacity for providing concise instruction interpretation is limited. However, I am confident that additional fine-tuning with a custom instruction dataset will allow Flare to achieve a level of comprehension comparable to DALL-E 3. This is already part of my roadmap.

❓ Why not use 7B models like Mistral etc.?  
👉 I am considering this, but it might increase system requirements even more, especially considering the fact that I am planning to use Stable Diffusion 3 as the primary image generator. And I think small models like Phi and Gemma must not be underestimated.

❓ Why not use vision models like LLaVA?  
👉 While it's entirely feasible, I found it unnecessary for the prototype. I might explore this option later on. Because of Flare's fully modular design, experimenting with different pipelines would be effortless.

❓ Looks like reinvention of [TaskMatrix](https://github.com/chenfei-wu/TaskMatrix) or [InstructPix2Pix](https://github.com/timothybrooks/instruct-pix2pix)?  
👉 Probably, but Flare's primary focus is on text-guided drawing with the utilization of open-source language models instead of ChatGPT and without using dedicated instruction-trained image editing model. Additionally, one of long-term objectives is to empower users to expand its functionality through plugins written in natural language.

❓ Isn't it the same concept as [DiffusionGPT](https://github.com/DiffusionGPT/DiffusionGPT)?  
👉 Likely, but I initiated Flare's development before discovering this project. Honestly, the idea of [multistage processing](https://www.reddit.com/r/StableDiffusion/comments/18em2yf/comment/kcpfsbe) itself is [basic](https://www.reddit.com/r/StableDiffusion/comments/1bl3gnk/comment/kw2y51q), and numerous comparable applications are anticipated to emerge soon, particularly with [SD3 release](https://twitter.com/StabilityAI/status/1770931861851947321?t=rWVHofu37x2P7GXGvxV7Dg) and projects like [ELLA](https://github.com/TencentQQGYLab/ELLA) or [EMILIE](https://arxiv.org/abs/2309.00613) gaining traction. 
 
## Credits

🔥 [Transformers](https://github.com/huggingface/transformers)  
🔥 [Guidance](https://github.com/guidance-ai/guidance)  
🔥 [Diffusers](https://github.com/huggingface/diffusers)  
🔥 [Segment Anything](https://github.com/facebookresearch/segment-anything)  
🔥 [Grounding DINO](https://github.com/IDEA-Research/GroundingDINO)  
🔥 [LaMa](https://github.com/advimman/lama)  
⚡ [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)  
⚡ [Phi-2](https://huggingface.co/microsoft/phi-2)  
💧 [FastAPI](https://github.com/tiangolo/fastapi)  
💧 [React](https://github.com/facebook/react)  
💧 [MantineUI](https://github.com/mantinedev/mantine)  

## Colab

COMING SOON