import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'DocuGallery Hub'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a', // slate-900
                    position: 'relative',
                }}
            >
                {/* Background Gradient Blob */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-20%',
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.4)', // cyan-500
                        filter: 'blur(100px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-20%',
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.4)', // blue-500
                        filter: 'blur(100px)',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20
                        }}
                    >
                        {/* Icon Placeholder (Simple Shield/Gallery shape) */}
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22d3ee" // cyan-400
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginRight: 24 }}
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <div
                            style={{
                                fontSize: 84,
                                fontWeight: 800,
                                letterSpacing: '-0.05em',
                                color: 'white',
                                fontFamily: 'sans-serif',
                            }}
                        >
                            DocuGallery
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 500,
                            color: '#cbd5e1', // slate-300
                            fontFamily: 'sans-serif',
                            letterSpacing: '0.05em',
                            marginTop: 10,
                            textTransform: 'uppercase',
                        }}
                    >
                        Enterprise Media Hub
                    </div>
                </div>

                {/* Branding Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 20,
                        color: '#64748b', // slate-500
                        fontFamily: 'sans-serif',
                    }}
                >
                    display-dokumentasi.vercel.app
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
