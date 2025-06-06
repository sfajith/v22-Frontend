import "../../index.css";

type ButtomProps = {
  content: string;
  job: () => void;
};

export function ButtomHospet({ content, job }: ButtomProps) {
  return (
    <>
      <button
        className="h-8 font-medium text-white transition-opacity duration-300 rounded-full cursor-pointer w-1/7 bg-gradient-mascoti hover:opacity-80"
        onClick={(e) => {
          job();
        }}
      >
        {content}
      </button>
    </>
  );
}
