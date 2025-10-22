import React from 'react'

const FormData = ({ header, value }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-4 border-b border-gray-200 items-center transition-colors hover:bg-gray-50">
            {/* Header Column */}
            <div className='font-semibold text-gray-600'>
                {header}
            </div>

            {/* Value Column */}
            <div className='sm:col-span-2 text-gray-800'>
                {value}
            </div>
        </div>
    )
}

export default FormData