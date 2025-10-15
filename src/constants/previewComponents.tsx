import { ElementType } from "@/types/global.type";
import React from "react";
import PreviewBaseComponent from "@/components/preview/PreviewBaseComponent";
import PreviewButtonComponent from "@/components/preview/PreviewButtonComponent";
import PreviewFrameComponent from "@/components/preview/PreviewFrameComponent";
import PreviewImageComponent from "@/components/preview/PreviewImageComponent";
import PreviewInputComponent from "@/components/preview/PreviewInputComponent";
import PreviewListComponent from "@/components/preview/PreviewListComponent";
import PreviewSectionComponent from "@/components/preview/PreviewSectionComponent";
import PreviewSelectComponent from "@/components/preview/PreviewSelectComponent";
import PreviewFormComponent from "@/components/preview/PreviewFormComponent";
import PreviewCarouselComponent from "@/components/preview/PreviewCarouselComponent";
import PreviewDataLoaderComponent from "@/components/preview/PreviewDataLoaderComponent";
import PreviewCMSContentListComponent from "@/components/preview/PreviewCMSContentListComponent";
import PreviewCMSContentItemComponent from "@/components/preview/PreviewCMSContentItemComponent";
import PreviewCMSContentGridComponent from "@/components/preview/PreviewCMSContentGridComponent";

interface PreviewComponentProps {
  element: any;
  data?: any;
}

const PreviewComponentMap = new Map<
  ElementType,
  React.ComponentType<PreviewComponentProps>
>([
  ["Text", PreviewBaseComponent],
  ["Button", PreviewButtonComponent],
  ["Section", PreviewSectionComponent],
  ["Image", PreviewImageComponent],
  ["Input", PreviewInputComponent],
  ["Select", PreviewSelectComponent],
  ["Link", PreviewBaseComponent],
  ["Form", PreviewFormComponent],
  ["Frame", PreviewFrameComponent],
  ["Carousel", PreviewCarouselComponent],
  ["List", PreviewListComponent],
  ["DataLoader", PreviewDataLoaderComponent],
  ["CMSContentList", PreviewCMSContentListComponent],
  ["CMSContentItem", PreviewCMSContentItemComponent],
  ["CMSContentGrid", PreviewCMSContentGridComponent],
]);

export const getPreviewComponentMap = (
  elementType: ElementType,
): React.ComponentType<PreviewComponentProps> | undefined => {
  return PreviewComponentMap.get(elementType);
};
