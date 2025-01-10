export default function MessageHeader({ userFullName }) {
  return (
    <div>
      <h2 className="font-bold">{userFullName}</h2>
      <p>Online</p>
    </div>
  );
}
