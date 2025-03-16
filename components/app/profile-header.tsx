import { ProfilePictureUpload } from "./profile-picture-upload";

export function ProfileHeader() {
  return (
    <div className="flex flex-1 shrink-0 items-center gap-7 sm:gap-5">
      <ProfilePictureUpload />

      <section>
        <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
          John Doe
        </h1>
        <p className="text-text-secondary text-sm leading-6">
          johndoe@gmail.com
        </p>
      </section>
    </div>
  );
}
