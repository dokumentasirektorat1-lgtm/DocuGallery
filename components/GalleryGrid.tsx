import { MediaFolder } from "@/lib/data"
import { MediaCard } from "./MediaCard"

interface GalleryGridProps {
    folders: MediaFolder[]
}

export function GalleryGrid({ folders }: GalleryGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folders.map((folder) => (
                <MediaCard key={folder.id} folder={folder} />
            ))}
        </div>
    )
}
