export function VideoPlayer({ src }: { src: string }) {
    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 shadow-lg">
            <video
                src={src}
                controls
                className="w-full h-full"
                poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1074&auto=format&fit=crop"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
