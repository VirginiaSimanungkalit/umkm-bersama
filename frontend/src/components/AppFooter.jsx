import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <span className="text-muted">Group CC26-PSU328</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)