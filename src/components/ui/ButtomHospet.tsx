import "../../index.css";

type ButtomProps = {
  content: string;
  job: () => void;
};

export function ButtomHospet({ content, job }: ButtomProps) {
  return (
    <>
      <button
        className="rounded-full w-1/7 h-8 bg-gradient-mascoti cursor-pointer font-medium text-white hover:opacity-80 transition-opacity duration-300"
        onClick={() => {
          job();
        }}
      >
        {content}
      </button>
    </>
  );
}
