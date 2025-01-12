export default function MessageHeader({ userFullName }: {userFullName: string}) {
  return (
    <div>
      <h2 className="font-bold">{userFullName}</h2>
      <p>Online</p>
    </div>
  );
}
