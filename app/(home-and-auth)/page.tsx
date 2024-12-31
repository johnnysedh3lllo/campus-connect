import Hero from "@/components/hero";
// import Navigation from "@/components/ui/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/utils/supabase/server";
import { insertProperty } from "../actions";
import { UserResponse } from "@supabase/supabase-js";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  }: UserResponse = await supabase.auth.getUser();

  const insertPropertyWithUserId = user?.id
    ? insertProperty.bind(null, user.id)
    : undefined;

  return (
    <>
      {user?.user_metadata.role_id === 2 && (
        <button className="p-4 bg-amber-200" onClick={insertPropertyWithUserId}>
          click me!
        </button>
      )}
      <Hero />
      <main className="p-12 gap-8">
        <div className="flex flex-col gap-8">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
            blanditiis libero iste? Sint similique nesciunt sed cum, repellendus
            aut neque. Numquam magni cumque esse inventore accusantium
            asperiores eligendi qui quia? Sunt rem repellat, quo et corrupti
            ratione repudiandae ipsam! Vero voluptatum fuga ipsa excepturi
            debitis unde. Corrupti placeat cupiditate quisquam, neque quis
            sapiente, suscipit, exercitationem adipisci provident optio magni.
            Earum. Dignissimos iste totam aliquam reiciendis cum porro, saepe
            exercitationem earum maiores doloribus sint, tenetur ducimus est
            vel. Unde voluptas, non quisquam eum tenetur quo hic illum deleniti,
            quaerat, ipsa doloribus. Accusantium possimus, illo cumque dicta
            minima omnis modi consequatur recusandae deserunt, laborum
            voluptatum non ipsum? Eveniet, quae harum fuga nobis exercitationem
            doloremque quis id ex autem porro assumenda, accusamus natus! Ipsum,
            itaque corrupti voluptate culpa aliquid vitae non aspernatur
            blanditiis, assumenda quisquam voluptatibus mollitia delectus?
            Praesentium impedit repellendus animi optio molestias, architecto
            cumque enim consectetur necessitatibus, quibusdam quis quaerat
            numquam. Placeat, quaerat sit? Optio amet, incidunt quis iusto
            expedita alias, mollitia sunt sed cupiditate voluptates iure. Quo
            itaque quaerat deserunt saepe voluptates fuga, nesciunt quasi id,
            neque alias, ratione omnis! Consequuntur tempora reprehenderit
            temporibus. Quia voluptatum, doloribus dolorum odit, maxime, est
            distinctio ad totam nam tenetur architecto consequuntur incidunt.
            Sit omnis quaerat harum eos illo! Ullam consectetur nemo beatae
            doloremque. Voluptas temporibus qui quae iure possimus repellat eum
            et officiis placeat deleniti, voluptate hic optio, quasi sed
            suscipit ipsa! Tenetur quia error saepe numquam rem fugit reiciendis
            iusto. Nihil, repellat?
          </p>{" "}
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
            blanditiis libero iste? Sint similique nesciunt sed cum, repellendus
            aut neque. Numquam magni cumque esse inventore accusantium
            asperiores eligendi qui quia? Sunt rem repellat, quo et corrupti
            ratione repudiandae ipsam! Vero voluptatum fuga ipsa excepturi
            debitis unde. Corrupti placeat cupiditate quisquam, neque quis
            sapiente, suscipit, exercitationem adipisci provident optio magni.
            Earum. Dignissimos iste totam aliquam reiciendis cum porro, saepe
            exercitationem earum maiores doloribus sint, tenetur ducimus est
            vel. Unde voluptas, non quisquam eum tenetur quo hic illum deleniti,
            quaerat, ipsa doloribus. Accusantium possimus, illo cumque dicta
            minima omnis modi consequatur recusandae deserunt, laborum
            voluptatum non ipsum? Eveniet, quae harum fuga nobis exercitationem
            doloremque quis id ex autem porro assumenda, accusamus natus! Ipsum,
            itaque corrupti voluptate culpa aliquid vitae non aspernatur
            blanditiis, assumenda quisquam voluptatibus mollitia delectus?
            Praesentium impedit repellendus animi optio molestias, architecto
            cumque enim consectetur necessitatibus, quibusdam quis quaerat
            numquam. Placeat, quaerat sit? Optio amet, incidunt quis iusto
            expedita alias, mollitia sunt sed cupiditate voluptates iure. Quo
            itaque quaerat deserunt saepe voluptates fuga, nesciunt quasi id,
            neque alias, ratione omnis! Consequuntur tempora reprehenderit
            temporibus. Quia voluptatum, doloribus dolorum odit, maxime, est
            distinctio ad totam nam tenetur architecto consequuntur incidunt.
            Sit omnis quaerat harum eos illo! Ullam consectetur nemo beatae
            doloremque. Voluptas temporibus qui quae iure possimus repellat eum
            et officiis placeat deleniti, voluptate hic optio, quasi sed
            suscipit ipsa! Tenetur quia error saepe numquam rem fugit reiciendis
            iusto. Nihil, repellat?
          </p>{" "}
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
            blanditiis libero iste? Sint similique nesciunt sed cum, repellendus
            aut neque. Numquam magni cumque esse inventore accusantium
            asperiores eligendi qui quia? Sunt rem repellat, quo et corrupti
            ratione repudiandae ipsam! Vero voluptatum fuga ipsa excepturi
            debitis unde. Corrupti placeat cupiditate quisquam, neque quis
            sapiente, suscipit, exercitationem adipisci provident optio magni.
            Earum. Dignissimos iste totam aliquam reiciendis cum porro, saepe
            exercitationem earum maiores doloribus sint, tenetur ducimus est
            vel. Unde voluptas, non quisquam eum tenetur quo hic illum deleniti,
            quaerat, ipsa doloribus. Accusantium possimus, illo cumque dicta
            minima omnis modi consequatur recusandae deserunt, laborum
            voluptatum non ipsum? Eveniet, quae harum fuga nobis exercitationem
            doloremque quis id ex autem porro assumenda, accusamus natus! Ipsum,
            itaque corrupti voluptate culpa aliquid vitae non aspernatur
            blanditiis, assumenda quisquam voluptatibus mollitia delectus?
            Praesentium impedit repellendus animi optio molestias, architecto
            cumque enim consectetur necessitatibus, quibusdam quis quaerat
            numquam. Placeat, quaerat sit? Optio amet, incidunt quis iusto
            expedita alias, mollitia sunt sed cupiditate voluptates iure. Quo
            itaque quaerat deserunt saepe voluptates fuga, nesciunt quasi id,
            neque alias, ratione omnis! Consequuntur tempora reprehenderit
            temporibus. Quia voluptatum, doloribus dolorum odit, maxime, est
            distinctio ad totam nam tenetur architecto consequuntur incidunt.
            Sit omnis quaerat harum eos illo! Ullam consectetur nemo beatae
            doloremque. Voluptas temporibus qui quae iure possimus repellat eum
            et officiis placeat deleniti, voluptate hic optio, quasi sed
            suscipit ipsa! Tenetur quia error saepe numquam rem fugit reiciendis
            iusto. Nihil, repellat?
          </p>
        </div>
      </main>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <ThemeSwitcher />
      </footer>
    </>
  );
}
