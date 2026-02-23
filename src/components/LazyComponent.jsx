import React, { Suspense } from 'react';

// Lazy loading component with loading fallback
const LazyComponent = ({ component: Component, fallback = null, ...props }) => {
  const LazyComponent = React.lazy(() => 
    import(`../components/${Component}.jsx`).catch(err => {
      console.error(`Failed to load component ${Component}:`, err);
      return () => (
        <div className="p-8 text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <div className="text-gray-700">
            Failed to load {Component}. Please refresh the page.
          </div>
        </div>
      );
    })
  );

  return (
    <Suspense 
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 border-t-blue-600"></div>
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;
