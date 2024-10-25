import { toast } from "sonner"
import {
  Check,
  Cloud,
  Github,
  Languages,
  Plus,
  Sparkles,
  Wand,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown"

import generateText, { generateTextOptions } from "./generateText"

type AskAIPropType = {
  setIsAiActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsGeneratingText: React.Dispatch<React.SetStateAction<boolean>>,
  setGenerativeTextResult: React.Dispatch<React.SetStateAction<string>>
}
export default function AskAI({ setIsAiActive, setIsGeneratingText, setGenerativeTextResult }: AskAIPropType) {
  const getAITextGeneration = async (options: generateTextOptions) => {
    setIsAiActive(true);
    setIsGeneratingText(true);
    const selectedText = window.getSelection();
    if (!selectedText) return setIsGeneratingText(false);

    const result = await generateText(options, selectedText.toString());
    if (!result.success) {
      setIsGeneratingText(false);
      return toast.error(result.error);
    }

    setGenerativeTextResult(result.data || "No result.");
    setIsGeneratingText(false);
  }
  return (
    <>
      <DropdownMenu >
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            className="flex cursor-pointer bg-neutral-50 rounded gap-1 p-2 w-fit items-center hover:bg-slate-100"
          >
            <Sparkles size={20} />
            Ask AI
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-medium text-neutral-400">Suggested</DropdownMenuLabel>
            <DropdownMenuItem>
              <Wand />
              <span onClick={() => getAITextGeneration(generateTextOptions.IMPROVE_WRITING)}>Improve writing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Check />
              <span>Fix spellings & grammar</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages size={15} className="mr-2" />
                <span>Translate</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Hindi
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Spanish
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    French
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-medium text-neutral-400">Edit</DropdownMenuLabel>
            <DropdownMenuItem>
              <Plus />
              <span>Make longer</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Github />
              <span>Make shorter</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cloud />
              <span>Simplify language</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
