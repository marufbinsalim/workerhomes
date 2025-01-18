const Facilities = ({ data }) => {
  return (
    <>
      <div className='col-xl-4'>
        <div className='row y-gap-30'>
          {data?.map(facility => (
            <div className='col-auto' key={facility.id}>
              <div>
                <div className='text-15 fw-500 text-blue-1 mb-8 text-capitalize'>
                  {facility.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Facilities
