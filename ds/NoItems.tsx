import DS from "design-system";
import {
  Blocks,
  Code,
  Layers,
  PhoneCall,
  SparkleIcon,
  Users,
  WandSparkles,
} from "lucide-react";

type NoItemsProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  loadingButton?: boolean;
};
export default function NoItems({
  title,
  description,
  buttonText,
  buttonAction,
  loadingButton = false,
}: NoItemsProps) {
  return (
    <div className="px-10   text-neutral-950 bg-white rounded-2xl border border-neutral-200 h-full items-center justify-center flex text-center">
      <div className=" flex flex-col items-center gap-10">
        <div className="flex items-center gap-5 justify-center   text-neutral-400">
          <SparkleIcon className="size-8 -rotate-12" />
          <Users className="size-10 animate-bounce" />
          <PhoneCall className="size-8 rotate-12" />
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-medium text-center ">{title}</h2>
          <p className="font-light text-sm text-center  text-neutral-600">
            {description}
          </p>
        </div>
        {buttonText && buttonAction && (
          <div className="flex items-center justify-center gap-5 ">
            <DS.Button
              text={buttonText}
              onClick={() => buttonAction()}
              variant="primary"
              size="lg"
              icon={WandSparkles}
              loading={loadingButton}
            />
          </div>
        )}
      </div>
    </div>
  );
}
