export default function MessageHeader({ userFullName: string }) {
  return (
    <div>
      <h2 className="font-bold">{userFullName}</h2>
      <p>Online</p>
    </div>
  );
}
