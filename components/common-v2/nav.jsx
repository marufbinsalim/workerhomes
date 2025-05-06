import React from 'react'

const Navbar = () => {
  return (
      <div className="tw:flex tw:items-center font-primary tw:justify-between tw:px-6 tw:py-2 tw:bg-white tw:border-b tw:mb-10">
          <div className="tw:px-8">
              <img src="/assets/logo.png" alt="workerhomes" className="tw:w-[200px] tw:h-[41px] tw:mb-6" />
          </div>

          {/* Navigation Links */}
          <div className="tw:flex tw:lg-flex tw:text-[var(--color-font-dark)] tw:font-normal tw:items-center tw:gap-6 tw:text-[14px]">
              <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Home</a>
              <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Pricing</a>
              <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Bookmarks</a>
              <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Blogs</a>
              <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Contact</a>
              
              <button className="tw:relative tw:w-[150px] tw:h-[33px] tw:text-sm tw:font-medium tw:text-[var(--color-primary)] tw:bg-white tw:rounded-sm tw:z-10 tw:overflow-hidden animated-border">
                  List your property
              </button>



          </div>

          {/* Right Section */}
          <div className="tw:flex tw:items-center tw:gap-4">
              <button className="tw:bg-[#040342] tw:text-white tw:text-[14px] tw:w-[150px] tw:h-[33px] tw:rounded-sm tw:text-sm tw:font-medium hover:tw:bg-orange-600">
                  Sign In / Register
              </button>

              {/* Language Selector */}
              <div className="tw:flex tw:items-center tw:gap-1 tw:cursor-pointer">
                  <img src="/assets/flag1.png" alt="UK Flag" className="tw:w-[32px] tw:h-[32px] tw:rounded-full" />
                  <img src="/assets/dropdown.png" alt="icon" className="tw:w-[13px] tw:h-[8px] tw:rounded-full" />
              </div>
          </div>
      </div>

  )
}

export default Navbar