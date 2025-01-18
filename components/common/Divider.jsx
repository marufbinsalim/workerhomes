const Divider = ({ side = 'center', title = '', className }) => {
  return (
    <div className={`divider divider-${side} ${className}`}>
      {title && <h5 className='divider-title'>{title}</h5>}
    </div>
  )
}

export default Divider
