export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <span className="text-red-600 text-xl mr-3">⚠️</span>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  )
}