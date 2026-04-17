from pydantic import BaseModel
from typing import Literal, Union

class TextElement(BaseModel):
    type: Literal["text"]
    content: str
    style: Literal["normal", "highlight", "formula"]

class FormulaElement(BaseModel):
    type: Literal["formula"]
    latex: str
    display: Literal["inline", "block"]

class GraphElement(BaseModel):
    type: Literal["graph"]
    expression: str
    variable: str
    domain: tuple[float, float]

class ColorBarElement(BaseModel):
    type: Literal["color_bar"]
    element_symbol: str
    flame_color: str
    wavelength_nm: float

Element = Union[TextElement, FormulaElement, GraphElement, ColorBarElement]

class Step(BaseModel):
    step_id: int
    title: str
    animation_type: Literal["fade", "slide", "draw", "pulse"]
    duration_ms: int
    elements: list[Element]

class Meta(BaseModel):
    subject: Literal["math", "chemistry"]
    topic: str
    difficulty: Literal["easy", "medium", "hard"]
    original_question: str

class VisualizationStep(BaseModel):
    model_config = {"protected_namespaces": ()}
    meta: Meta
    steps: list[Step]
    final_answer: str
    model_used: str = "gemma3"
