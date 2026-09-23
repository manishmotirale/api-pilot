import { currentUser } from "@/modules/authentication/actions";
import UserButton from "@/modules/authentication/components/user-button";

export default async function Home() {
  const user = await currentUser();
  return (
    <div>
      <UserButton user={user} />
    </div>
  );
}
