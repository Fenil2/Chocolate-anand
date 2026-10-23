export function AnnouncementBar({ message }: { message: string }) {
  return (
    <div className="relative z-[60] bg-chocolate/80 text-center">
      <p className="px-4 py-2 font-sans text-[0.6rem] tracking-[0.14em] min-[380px]:text-[0.64rem] min-[380px]:tracking-[0.2em] sm:text-[0.68rem] sm:tracking-[0.28em] text-beige uppercase">{message}</p>
    </div>
  );
}
