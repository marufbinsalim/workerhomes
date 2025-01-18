const Overview = ({ data }) => {
  return (
    <>
      <h3 className='text-22 fw-500 pt-40 border-top-light'>Overview</h3>
      <p
        className='text-dark-1 text-15 mt-20'
        dangerouslySetInnerHTML={{ __html: data }}
      ></p>
    </>
  )
}

export default Overview
