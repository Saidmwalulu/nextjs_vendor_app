import React from 'react'
import { DotLoader } from 'react-spinners';

type LoaderProps = {
    isLoading?: boolean;
}

function Loader({ isLoading = true }: LoaderProps) {
  return (
    <div>
        <DotLoader
            color='#2563eb'
            loading={isLoading} 
            size={60}
            aria-label='Loading Spinner'
            data-testid='loader'
            speedMultiplier={1}
        />
    </div>
  )
}

export default Loader