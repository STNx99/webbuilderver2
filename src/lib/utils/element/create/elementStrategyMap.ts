import { ElementType } from "@/types/global.type";
import {
  ButtonElementCreateStrategy,
  CarouselElementCreateStrategy,
  CMSContentGridElementCreateStrategy,
  CMSContentItemElementCreateStrategy,
  CMSContentListElementCreateStrategy,
  DataLoaderElementCreateStrategy,
  ElementCreateStrategy,
  FormElementCreateStrategy,
  FrameElementCreateStrategy,
  ImageElementCreateStrategy,
  InputElementCreateStrategy,
  ListElementCreateStrategy,
  SectionElementCreateStrategy,
  SelectElementCreateStrategy,
  TextElementCreateStrategy,
} from "./elementCreateStrategy";

export const ElementStrategyMap: Map<ElementType, ElementCreateStrategy> =
  new Map([
    ["Text", new TextElementCreateStrategy()],
    ["Image", new ImageElementCreateStrategy()],
    ["Frame", new FrameElementCreateStrategy()],
    ["Button", new ButtonElementCreateStrategy()],
    ["Input", new InputElementCreateStrategy()],
    ["List", new ListElementCreateStrategy()],
    ["Select", new SelectElementCreateStrategy()],
    ["Form", new FormElementCreateStrategy()],
    ["Section", new SectionElementCreateStrategy()],
    ["Carousel", new CarouselElementCreateStrategy()],
    ["DataLoader", new DataLoaderElementCreateStrategy()],
    ["CMSContentList", new CMSContentListElementCreateStrategy()],
    ["CMSContentItem", new CMSContentItemElementCreateStrategy()],
    ["CMSContentGrid", new CMSContentGridElementCreateStrategy()],
  ]);

export const getElementStrategy = (
  type: ElementType,
): ElementCreateStrategy => {
  const strategy = ElementStrategyMap.get(type);
  if (!strategy) {
    throw new Error(`No strategy found for element type: ${type}`);
  }
  return strategy;
};
