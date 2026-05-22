import React from 'react'

export const Logo = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '200px', margin: '0 auto' }}>
      <svg
        width="150"
        height="40"
        viewBox="0 0 1024 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        <path
          d="M89.375 192.833V122.917L28.1667 87.5834V157.5L89.375 192.833Z"
          fill="currentColor"
        />
        <path
          d="M211.833 122.917V53L150.625 17.6667V87.5834L211.833 122.917Z"
          fill="currentColor"
        />
        <path
          d="M98.125 208L150.625 238.333L273.125 167.583L220.625 137.25L98.125 208Z"
          fill="currentColor"
        />
        <path
          d="M264.375 118L211.875 87.6667L89.375 158.417L141.875 188.75L264.375 118Z"
          fill="currentColor"
        />
        <path
          d="M281.875 87.6667L229.375 57.3334L106.875 128.083L159.375 158.417L281.875 87.6667Z"
          fill="currentColor"
        />
        <text
          x="320"
          y="180"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="140"
          fontWeight="bold"
          fill="currentColor"
          letterSpacing="-4"
        >
          Payload
        </text>
      </svg>
    </div>
  )
}
