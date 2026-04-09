import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="nf">
        <h3>404</h3>
        <h3>Page not found</h3>
        <Link href="/" className="nf-link">
          Back Home
        </Link>
        {/* <Link href="/forum" className="nf-link">
          Back To Forum
        </Link> */}
      </div>
    </>
  );
}
