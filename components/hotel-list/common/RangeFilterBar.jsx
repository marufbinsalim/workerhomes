'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'

const RangeFilterBar = ({
    priceValue,
    setPriceValue,
    guestValue,
    setGuestNumber,
    minStayValue,
    setMinStayValue,
    onClose
}) => {
    const t = useTranslations('listings')

    // Predefined ranges
    const PRICE_RANGES = [
        { min: 0, max: 500, value: 'LOWER_THAN_500', text: 'Less than $500' },
        { min: 500, max: 1000, value: 'BETWEEN_500_AND_1000', text: '$500 - $1000' },
        { min: 1000, max: 2000, value: 'BETWEEN_1000_AND_2000', text: '$1000 - $2000' },
        { min: 2000, max: 3000, value: 'BETWEEN_2000_AND_3000', text: '$2000 - $3000' },
        { min: 3000, max: 5000, value: 'GREATER_THAN_3000', text: 'More than $3000' }
    ]

    const GUEST_RANGES = [
        { min: 0, max: 5, value: 'LOWER_THAN_5', text: 'Less than 5' },
        { min: 5, max: 10, value: 'BETWEEN_5_AND_10', text: '5 - 10' },
        { min: 10, max: 15, value: 'BETWEEN_10_AND_15', text: '10 - 15' },
        { min: 15, max: 20, value: 'GREATER_THAN_15', text: 'More than 15' }
    ]

    const STAY_RANGES = [
        { min: 0, max: 5, value: 'LOWER_THAN_5', text: 'Less than 5 days' },
        { min: 5, max: 10, value: 'BETWEEN_5_AND_10', text: '5 - 10 days' },
        { min: 10, max: 15, value: 'BETWEEN_10_AND_15', text: '10 - 15 days' },
        { min: 15, max: 30, value: 'GREATER_THAN_15', text: 'More than 15 days' }
    ]

    // Default values
    const DEFAULT_PRICE = { id: 0, text: 'All Prices', value: 'ALL' }
    const DEFAULT_GUEST = { id: 0, text: 'All', value: 'ALL' }
    const DEFAULT_STAY = { id: 0, text: 'All', value: 'ALL' }

    // Initialize state with current filter values
    const [activePrice, setActivePrice] = useState(
        PRICE_RANGES.find(r => r.value === priceValue.value) || PRICE_RANGES[0]
    )
    const [activeGuest, setActiveGuest] = useState(
        GUEST_RANGES.find(r => r.value === guestValue.value) || GUEST_RANGES[0]
    )
    const [activeStay, setActiveStay] = useState(
        STAY_RANGES.find(r => r.value === minStayValue.value) || STAY_RANGES[0]
    )

    const sliderRefs = {
        price: useRef(null),
        guest: useRef(null),
        stay: useRef(null)
    }

    // Track drag state and direction
    const dragState = useRef({
        isDragging: false,
        type: null,
        isMin: false,
        startX: 0,
        startRange: null
    })

    const handleResetFilters = () => {
        setActivePrice(PRICE_RANGES[0])
        setActiveGuest(GUEST_RANGES[0])
        setActiveStay(STAY_RANGES[0])
        setPriceValue(DEFAULT_PRICE)
        setGuestNumber(DEFAULT_GUEST)
        setMinStayValue(DEFAULT_STAY)
    }

    const handlePointerDown = (type, isMin, e) => {
        const clientX = e.clientX || e.touches[0].clientX
        dragState.current = {
            isDragging: true,
            type,
            isMin,
            startX: clientX,
            startRange: type === 'price' ? activePrice :
                type === 'guest' ? activeGuest : activeStay
        }

        // Prevent text selection during drag
        e.preventDefault()
    }

    const handlePointerMove = (e) => {
        if (!dragState.current.isDragging) return

        const clientX = e.clientX || e.touches[0].clientX
        const deltaX = clientX - dragState.current.startX

        // Only consider the drag significant if moved at least 10px
        if (Math.abs(deltaX) < 10) return

        const { type, isMin, startRange } = dragState.current
        const ranges = type === 'price' ? PRICE_RANGES :
            type === 'guest' ? GUEST_RANGES : STAY_RANGES

        const currentIndex = ranges.findIndex(r => r.value === startRange.value)
        let newIndex = currentIndex

        if (deltaX > 0) { // Dragged right
            if (!isMin && currentIndex < ranges.length - 1) {
                newIndex = currentIndex + 1
            }
        } else { // Dragged left
            if (isMin && currentIndex > 0) {
                newIndex = currentIndex - 1
            }
        }

        if (newIndex !== currentIndex) {
            const newRange = ranges[newIndex]
            if (type === 'price') {
                setActivePrice(newRange)
                setPriceValue({ id: 0, text: newRange.text, value: newRange.value })
            } else if (type === 'guest') {
                setActiveGuest(newRange)
                setGuestNumber({ id: 0, text: newRange.text, value: newRange.value })
            } else {
                setActiveStay(newRange)
                setMinStayValue({ id: 0, text: newRange.text, value: newRange.value })
            }

            // Reset drag state after change
            dragState.current.isDragging = false
        }
    }

    const handlePointerUp = () => {
        dragState.current.isDragging = false
    }

    // Add event listeners
    useEffect(() => {
        const handleMove = (e) => handlePointerMove(e)
        const handleUp = () => handlePointerUp()

        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleUp)
        window.addEventListener('touchmove', handleMove)
        window.addEventListener('touchend', handleUp)

        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('touchmove', handleMove)
            window.removeEventListener('touchend', handleUp)
        }
    }, [])

    const renderRangeSlider = (type, ranges, activeRange, maxValue) => {
        const minPos = (activeRange.min / maxValue) * 100
        const maxPos = (activeRange.max / maxValue) * 100
        const width = maxPos - minPos

        // Determine labels based on type
        let minLabel = t('labels.min');
        let maxLabel = t('labels.max');

        if (type === 'guest') {
            minLabel = t('labels.minPerson');
            maxLabel = t('labels.maxPerson');
        } else if (type === 'stay') {
            minLabel = t('labels.minDays');
            maxLabel = t('labels.maxDays');
        } else if (type === 'price') {
            minLabel = t('labels.minPrice');
            maxLabel = t('labels.maxPrice');
        }

        return (
            <div className="tw:mb-1 font-primary">
                {/* Section Title */}
                <h3 className="tw:font-semibold tw:text-base tw:text-[16px] tw:text-[var(--color-font-dark)] tw:leading-[100%] tw:tracking-normal tw:align-middle tw:mb-4">
                    {t(`filters.${type}`)}
                </h3>

                {/* Min/Max Labels */}
                <div className="tw:flex tw:gap-3 tw:mb-3">
                    {/* Min box with label */}
                    <div className="tw:flex tw:flex-col tw:gap-1">
                        <span className="tw:font-medium tw:text-sm tw:text-[var(--color-font-regular)] tw:leading-[100%]">
                            {minLabel}
                        </span>
                        <div className="tw:w-[165px] tw:md:w-[193px] tw:h-[38px] tw:flex tw:items-center tw:justify-start tw:border tw:border-[#D8E0ED] tw:bg-white tw:rounded tw:px-4">
                            <span className="tw:text-sm tw:font-normal">
                                {type === 'price' ? `$${activeRange.min}` : `${activeRange.min}`}
                            </span>
                        </div>
                    </div>

                    {/* Max box with label */}
                    <div className="tw:flex tw:flex-col tw:gap-1">
                        <span className="tw:font-medium tw:text-[var(--color-font-regular)] tw:text-sm tw:leading-[100%]">
                            {maxLabel}
                        </span>
                        <div className="tw:w-[165px] tw:md:w-[193px] tw:h-[38px] tw:flex tw:items-center tw:justify-start tw:border tw:border-[#D8E0ED] tw:bg-white tw:rounded tw:px-4">
                            <span className="tw:text-sm tw:font-normal">
                                {type === 'price' ? `$${activeRange.max}` : `${activeRange.max}`}
                            </span>
                        </div>
                    </div>
                </div>


                {/* Slider */}
                <div
                    className="tw:relative tw:flex tw:items-center tw:w-full tw:h-[12px] tw:mb-5"
                    ref={sliderRefs[type]}
                >
                    {/* Background line */}
                    <div className="tw:absolute tw:w-full tw:h-full tw:rounded-full tw:bg-[#F3F4F8]"></div>

                    {/* Active range highlight */}
                    <div
                        className="tw:absolute tw:h-full tw:rounded-full tw:bg-[var(--color-primary)]"
                        style={{
                            left: `${minPos}%`,
                            width: `calc(${maxPos}% - ${minPos}% + 10px)`
                        }}
                    ></div>

                    {/* Min circle */}
                    <div
                        className="tw:absolute tw:transform -tw:translate-y-1/2 tw:cursor-pointer tw:z-10 tw:w-5 tw:h-5 tw:rounded-full tw:bg-[var(--color-primary)] tw:border-[1.25px] tw:border-white tw:shadow-sm"
                        style={{ left: `${minPos}%` }}
                        onMouseDown={(e) => handlePointerDown(type, true, e)}
                        onTouchStart={(e) => handlePointerDown(type, true, e)}
                    ></div>

                    {/* Max circle */}
                    <div
                        className="tw:absolute tw:transform -tw:translate-y-1/2 tw:cursor-pointer tw:z-10 tw:w-5 tw:h-5 tw:rounded-full tw:bg-[var(--color-primary)] tw:border-[1.25px] tw:border-white tw:shadow-sm"
                        style={{ left: `calc(${maxPos}% - 10px)` }}
                        onMouseDown={(e) => handlePointerDown(type, false, e)}
                        onTouchStart={(e) => handlePointerDown(type, false, e)}
                    ></div>
                </div>
            </div>
        )
    }

    return (
        <div className="tw:px-5 tw:py-5 tw:flex tw:flex-col font-primary">
            {/* Modal Header */}
            <div className="tw:relative tw:mb-6">
                {/* Title */}
                <h2 className="tw:text-lg tw:text-[var(--color-font-dark)] tw:font-semibold"> {t('filter')} </h2>

                {/* X Icon */}
                <button
                    onClick={onClose}
                    className="tw:absolute tw:top-0 tw:right-0 tw:text-[var(--color-font-dark)] tw:cursor-pointer"
                >
                    <X size={20} className="tw:w-4 tw:h-4" />
                </button>
            </div>


            {/* Filter Sections */}
            <div className="tw:flex tw:flex-col tw:gap-6">
                {/* Guests Range */}
                {renderRangeSlider('guest', GUEST_RANGES, activeGuest, 20)}

                {/* Minimum Stay Range */}
                {renderRangeSlider('stay', STAY_RANGES, activeStay, 30)}

                {/* Price Range */}
                {renderRangeSlider('price', PRICE_RANGES, activePrice, 5000)}
            </div>

            {/* Reset Button */}
            <div className="tw:flex tw:justify-end tw:mt-6">
                <button
                    onClick={handleResetFilters}
                    className="tw:text-[var(--color-primary)] tw:font-medium tw:text-sm tw:px-4 tw:py-1 tw:border tw:border-[var(--color-primary)] tw:rounded-md tw:hover:bg-[#f2f4f7] tw:hover:border-[#d0d5dd] tw:transition-colors"
                >
                    {t('resetFilters')}
                </button>

            </div>
        </div>
    )
}

export default RangeFilterBar