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

    const rangeConfigs = {
        price: {
            min: 0,
            max: 5000,
            step: 100,
            prefix: '$',
            suffix: '',
            ranges: [
                { min: 0, max: 500, value: 'LOWER_THAN_500', text: 'Less than $500' },
                { min: 500, max: 1000, value: 'BETWEEN_500_AND_1000', text: '$500 - $1000' },
                { min: 1000, max: 2000, value: 'BETWEEN_1000_AND_2000', text: '$1000 - $2000' },
                { min: 2000, max: 3000, value: 'BETWEEN_2000_AND_3000', text: '$2000 - $3000' },
                { min: 3000, max: 5000, value: 'GREATER_THAN_3000', text: 'More than $3000' }
            ]
        },
        guest: {
            min: 1,
            max: 20,
            step: 1,
            prefix: '',
            suffix: '',
            ranges: [
                { min: 1, max: 5, value: 'LOWER_THAN_5', text: '1 - 5' },
                { min: 5, max: 10, value: 'BETWEEN_5_AND_10', text: '5 - 10' },
                { min: 10, max: 15, value: 'BETWEEN_10_AND_15', text: '10 - 15' },
                { min: 15, max: 20, value: 'GREATER_THAN_15', text: '15 - 20' }
            ]
        },
        stay: {
            min: 1,
            max: 30,
            step: 1,
            prefix: '',
            suffix: ' days',
            ranges: [
                { min: 1, max: 5, value: 'LOWER_THAN_5', text: '1 - 5 days' },
                { min: 5, max: 10, value: 'BETWEEN_5_AND_10', text: '5 - 10 days' },
                { min: 10, max: 15, value: 'BETWEEN_10_AND_15', text: '10 - 15 days' },
                { min: 15, max: 30, value: 'GREATER_THAN_15', text: '15 - 30 days' }
            ]
        }
    }

    const [activeRanges, setActiveRanges] = useState({
        price: getInitialRange(priceValue, 'price'),
        guest: getInitialRange(guestValue, 'guest'),
        stay: getInitialRange(minStayValue, 'stay')
    })

    const sliderRefs = {
        price: useRef(null),
        guest: useRef(null),
        stay: useRef(null)
    }

    const dragState = useRef({
        isDragging: false,
        type: null,
        handle: null,
        startX: 0,
        startValue: 0
    })

    function getInitialRange(value, type) {
        if (!value || value.value === 'ALL') {
            // Set initial range to first step above min
            const initialMin = rangeConfigs[type].min
            const initialMax = type === 'price'
                ? initialMin + 500  // $500 for price
                : initialMin + 4    // 4 for guests/stays (1-5 range)

            return {
                min: initialMin,
                max: initialMax,
                value: `${type.toUpperCase()}_${initialMin}_${initialMax}`,
                text: type === 'price'
                    ? `$${initialMin} - $${initialMax}`
                    : `${initialMin} - ${initialMax}${type === 'stay' ? ' days' : ''}`
            }
        }

        // Handle custom range format (TYPE_MIN_MAX)
        if (value.value.includes('_')) {
            const [min, max] = value.value.split('_').slice(1).map(Number)
            return {
                min,
                max,
                value: value.value,
                text: type === 'price'
                    ? `$${min} - $${max}`
                    : `${min} - ${max}${type === 'stay' ? ' days' : ''}`
            }
        }

        // Handle predefined ranges
        const predefinedRange = rangeConfigs[type].ranges.find(r => r.value === value.value)
        if (predefinedRange) {
            return {
                min: predefinedRange.min,
                max: predefinedRange.max,
                value: predefinedRange.value,
                text: predefinedRange.text
            }
        }

        // Fallback to initial range
        const initialMin = rangeConfigs[type].min
        const initialMax = type === 'price'
            ? initialMin + 500  // $500 for price
            : initialMin + 4    // 4 for guests/stays (1-5 range)

        return {
            min: initialMin,
            max: initialMax,
            value: `${type.toUpperCase()}_${initialMin}_${initialMax}`,
            text: type === 'price'
                ? `$${initialMin} - $${initialMax}`
                : `${initialMin} - ${initialMax}${type === 'stay' ? ' days' : ''}`
        }
    }

    const handleResetFilters = () => {
        const resetRanges = {
            price: {
                min: rangeConfigs.price.min,
                max: rangeConfigs.price.min + 500, // Reset to 0-500 for price
                value: 'PRICE_0_500',
                text: '$0 - $500'
            },
            guest: {
                min: rangeConfigs.guest.min,
                max: rangeConfigs.guest.min + 4, // Reset to 1-5 for guests
                value: 'GUEST_1_5',
                text: '1 - 5'
            },
            stay: {
                min: rangeConfigs.stay.min,
                max: rangeConfigs.stay.min + 4, // Reset to 1-5 for stays
                value: 'STAY_1_5',
                text: '1 - 5 days'
            }
        }

        setActiveRanges(resetRanges)
        setPriceValue({ id: 0, text: resetRanges.price.text, value: resetRanges.price.value })
        setGuestNumber({ id: 0, text: resetRanges.guest.text, value: resetRanges.guest.value })
        setMinStayValue({ id: 0, text: resetRanges.stay.text, value: resetRanges.stay.value })
    }

    const handlePointerDown = (type, handle, e) => {
        const clientX = e.clientX || e.touches[0].clientX
        dragState.current = {
            isDragging: true,
            type,
            handle,
            startX: clientX,
            startValue: handle === 'min' ? activeRanges[type].min : activeRanges[type].max
        }
        e.preventDefault()
    }

    const handlePointerMove = (e) => {
        if (!dragState.current.isDragging) return

        const { type, handle, startX, startValue } = dragState.current
        const config = rangeConfigs[type]
        const slider = sliderRefs[type].current
        if (!slider) return

        const sliderRect = slider.getBoundingClientRect()
        const sliderWidth = sliderRect.width
        const clientX = e.clientX || e.touches[0].clientX
        const deltaX = clientX - startX

        // Calculate the value change based on the step size
        const pixelsPerStep = sliderWidth / ((config.max - config.min) / config.step)
        const steps = Math.round(deltaX / pixelsPerStep)
        let newValue = startValue + (steps * config.step)

        // Constrain to min/max
        newValue = Math.max(config.min, Math.min(newValue, config.max))

        // Prevent handles from crossing each other
        const currentRange = activeRanges[type]
        let newMin = handle === 'min' ? newValue : currentRange.min
        let newMax = handle === 'max' ? newValue : currentRange.max

        if (handle === 'min') {
            newMin = Math.min(newValue, currentRange.max - config.step)
        } else {
            newMax = Math.max(newValue, currentRange.min + config.step)
        }

        // Create custom range value (TYPE_MIN_MAX format)
        const newRange = {
            min: newMin,
            max: newMax,
            value: `${type.toUpperCase()}_${newMin}_${newMax}`,
            text: type === 'price'
                ? `$${newMin} - $${newMax}`
                : `${newMin} - ${newMax}${type === 'stay' ? ' days' : ''}`
        }

        setActiveRanges(prev => ({
            ...prev,
            [type]: newRange
        }))
    }

    const handlePointerUp = () => {
        if (dragState.current.isDragging) {
            const { type } = dragState.current
            const currentRange = activeRanges[type]

            // Update parent component with the new range
            const filterValue = {
                id: 0,
                text: currentRange.text,
                value: currentRange.value
            }

            if (type === 'price') {
                setPriceValue(filterValue)
            } else if (type === 'guest') {
                setGuestNumber(filterValue)
            } else {
                setMinStayValue(filterValue)
            }

            dragState.current.isDragging = false
        }
    }

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
    }, [activeRanges])

    const renderRangeSlider = (type) => {
        const config = rangeConfigs[type]
        const range = activeRanges[type]
        const minPos = ((range.min - config.min) / (config.max - config.min)) * 100
        const maxPos = ((range.max - config.min) / (config.max - config.min)) * 100
        const width = maxPos - minPos

        const labels = {
            price: {
                min: t('labels.minPrice'),
                max: t('labels.maxPrice')
            },
            guest: {
                min: t('labels.minPerson'),
                max: t('labels.maxPerson')
            },
            stay: {
                min: t('labels.minDays'),
                max: t('labels.maxDays')
            }
        }

        return (
            <div className="tw:mb-6 tw:font-primary">
                <h3 className="tw:font-semibold tw:text-base tw:text-[var(--color-font-dark)] tw:mb-4">
                    {t(`filters.${type}`)}
                </h3>

                <div className="tw:flex tw:gap-3 tw:mb-3">
                    <div className="tw:flex tw:flex-col tw:gap-1">
                        <span className="tw:font-medium tw:text-sm tw:text-[var(--color-font-regular)]">
                            {labels[type].min}
                        </span>
                        <div className="tw:w-[165px] tw:md:w-[193px] tw:h-[38px] tw:flex tw:items-center tw:justify-start tw:border tw:border-[#D8E0ED] tw:bg-white tw:rounded tw:px-4">
                            <span className="tw:text-sm tw:font-normal">
                                {config.prefix}{range.min}{config.suffix}
                            </span>
                        </div>
                    </div>

                    <div className="tw:flex tw:flex-col tw:gap-1">
                        <span className="tw:font-medium tw:text-[var(--color-font-regular)] tw:text-sm">
                            {labels[type].max}
                        </span>
                        <div className="tw:w-[165px] tw:md:w-[193px] tw:h-[38px] tw:flex tw:items-center tw:justify-start tw:border tw:border-[#D8E0ED] tw:bg-white tw:rounded tw:px-4">
                            <span className="tw:text-sm tw:font-normal">
                                {config.prefix}{range.max}{config.suffix}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className="tw:relative tw:flex tw:items-center tw:w-full tw:h-[12px] tw:mb-5"
                    ref={sliderRefs[type]}
                >
                    <div className="tw:absolute tw:w-full tw:h-full tw:rounded-full tw:bg-[#F3F4F8]"></div>
                    <div
                        className="tw:absolute tw:h-full tw:rounded-full tw:bg-[var(--color-primary)]"
                        style={{ left: `${minPos}%`, width: `${width}%` }}
                    ></div>
                    <div
                        className="tw:absolute tw:transform -tw:translate-y-1/2 tw:cursor-pointer tw:z-10 tw:w-5 tw:h-5 tw:rounded-full tw:bg-[var(--color-primary)] tw:border-[1.25px] tw:border-white tw:shadow-sm tw:transition-transform hover:tw:scale-110 active:tw:scale-125"
                        style={{ left: `${minPos}%` }}
                        onMouseDown={(e) => handlePointerDown(type, 'min', e)}
                        onTouchStart={(e) => handlePointerDown(type, 'min', e)}
                    ></div>
                    <div
                        className="tw:absolute tw:transform -tw:translate-y-1/2 tw:cursor-pointer tw:z-10 tw:w-5 tw:h-5 tw:rounded-full tw:bg-[var(--color-primary)] tw:border-[1.25px] tw:border-white tw:shadow-sm tw:transition-transform hover:tw:scale-110 active:tw:scale-125"
                        style={{ left: `${maxPos}%` }}
                        onMouseDown={(e) => handlePointerDown(type, 'max', e)}
                        onTouchStart={(e) => handlePointerDown(type, 'max', e)}
                    ></div>
                </div>
            </div>
        )
    }

    return (
        <div className="tw:px-5 tw:py-5 tw:flex tw:flex-col tw:font-primary tw:bg-white tw:rounded-lg tw:shadow-xl tw:max-w-md tw:w-full">
            <div className="tw:relative tw:mb-6">
                <h2 className="tw:text-lg tw:text-[var(--color-font-dark)] tw:font-semibold">
                    {t('filter')}
                </h2>
                <button
                    onClick={onClose}
                    className="tw:absolute tw:top-0 tw:right-0 tw:text-[var(--color-font-dark)] hover:tw:text-[var(--color-font-darker)] tw:cursor-pointer tw:transition-colors"
                >
                    <X size={20} className="tw:w-4 tw:h-4" />
                </button>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-6">
                {renderRangeSlider('guest')}
                {renderRangeSlider('stay')}
                {renderRangeSlider('price')}
            </div>

            <div className="tw:flex tw:justify-end tw:mt-6">
                <button
                    onClick={handleResetFilters}
                    className="tw:px-4 tw:py-2 tw:text-[var(--color-primary)] tw:font-medium tw:text-sm tw:border tw:border-[var(--color-primary)] tw:rounded-md hover:tw:bg-[#f2f4f7] tw:transition-colors"
                >
                    {t('resetFilters')}
                </button>
            </div>
        </div>
    )
}

export default RangeFilterBar