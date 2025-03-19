import Image from "next/image";
export default function EmptyPageState() {
    return (
        <section className="mx-auto flex flex-col items-center gap-10 sm:gap-12 py-15" aria-live="polite">
            <figure className="mx-auto">
                <Image src={"/illustrations/illustration-house.svg"} alt="Empty house illustration" width={146.341} height={146.341} />
            </figure>

            <header className="text-center">
                <h2 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">No Properties Listed</h2>
                <p className="text-text-secondary text-sm leading-6">This landlord has not listed a property yet.</p>
            </header>
        </section>
    );
}