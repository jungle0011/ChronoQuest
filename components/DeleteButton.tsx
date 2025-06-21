"use client"

import { useState } from "react"
import { FaTrash } from "react-icons/fa"

interface DeleteButtonProps {
  id: string
  onDelete: () => void
}

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business?')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/businesses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete business')
      }

      onDelete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
        title="Delete Business"
      >
        <FaTrash className="h-5 w-5" />
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </>
  )
}
