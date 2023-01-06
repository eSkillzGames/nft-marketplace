import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import theme from 'src/views/mint/theme'
// routes config
import routes from '../routes'
import { CssBaseline, ThemeProvider } from '@mui/material'

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <ThemeProvider theme={theme}>
          {/* <CssBaseline/> */}

        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
        </ThemeProvider>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
