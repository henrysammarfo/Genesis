import Link from 'next/link';

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="mb-4">There was an error authenticating your account.</p>
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
                Return to Sign In
            </Link>
        </div>
    );
}
