interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-center">
        <span className="text-2xl mr-3">⚠️</span>
        <p className="text-red-800 font-medium">{message}</p>
      </div>
    </div>
  )
}