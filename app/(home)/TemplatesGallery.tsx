"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import React from "react";
import { toast } from "sonner";

const Templates = [
  { id: "blank",             label: "Blank",            imageUrl: "/blank-document.svg" },
  { id: "resume",            label: "Resume",           imageUrl: "/resume.svg" },
  { id: "cover-letter",      label: "Cover Letter",     imageUrl: "/cover-letter.svg" },
  { id: "Buisness letter",   label: "Buisness Letter",  imageUrl: "/business-letter.svg" },
  { id: "project-proposal",  label: "Project Proposal", imageUrl: "/project-proposal.svg" },
  { id: "Letter",            label: "Letter",           imageUrl: "/letter.svg" },
  { id: "Software-proposal", label: "Software Proposal",imageUrl: "/software-proposal.svg" },
];

export const TemplatesGallery = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = React.useState(false);

const OnTemplateClicked = (title: string, initialContent: string) => async () => {
  setIsCreating(true);
  create({ title, initialContent })
    .then((documentId) => {
      toast.success(`${title} created successfully`);
      router.push(`/docs/${documentId}`);
    })
    .catch((error) => {
      const errorMessage = error?.data || error?.message || "";
      if (errorMessage.includes("organization")) {
        toast.error("You must be part of an organization to create documents.");
      } else {
        toast.error("Failed to create document.");
      }
    })
    .finally(() => {
      setIsCreating(false);
    });
};
  
  return (
    <div className="bg-[#f1f3f4] select-none">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 py-4 sm:py-6 flex flex-col gap-y-4">
        <h3 className="text-sm font-medium text-[#444746]">Start a new document</h3>

        <div className="relative">
          <Carousel opts={{ align: "start", slidesToScroll: 2 }}>
            <CarouselContent className="-ml-2 sm:-ml-3">
              {Templates.map((template) => (
                <CarouselItem
                  key={template.id}
                  className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-2 sm:pl-3"
                >
                  <div
                    className={cn(
                      "flex flex-col gap-y-2",
                      isCreating && "pointer-events-none opacity-50"
                    )}
                  >
                    <button
                      disabled={isCreating}
                      onClick={OnTemplateClicked(template.label, " ")}
                      className={cn(
                        "w-full aspect-[3/4] rounded border border-[#e0e0e0] bg-white overflow-hidden",
                        "hover:border-[#4285f4] hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_rgba(60,64,67,0.15)]",
                        "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285f4]"
                      )}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={template.imageUrl}
                          alt={template.label}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>

                    <p className="text-xs text-[#444746] truncate text-center">
                      {template.label}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-3 sm:-left-5 bg-white border border-[#dadce0] shadow-sm hover:bg-[#f1f3f4] text-[#5f6368]" />
            <CarouselNext    className="-right-3 sm:-right-5 bg-white border border-[#dadce0] shadow-sm hover:bg-[#f1f3f4] text-[#5f6368]" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};