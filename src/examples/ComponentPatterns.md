import React, { useState } from 'react';

// ============================================
// 1. FUNCTION DECLARATION (Most Common)
// ============================================
// Traditional function declaration - hoisted, can be called before definition
function FunctionDeclaration() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
}

// ============================================
// 2. ARROW FUNCTION (Modern, Popular)
// ============================================
// Arrow function - concise, commonly used in modern React
const ArrowFunction = () => {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
};

// ============================================
// 3. ARROW FUNCTION WITH EXPLICIT RETURN
// ============================================
// Arrow function with explicit return statement
const ArrowFunctionExplicit = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// ============================================
// 4. ARROW FUNCTION WITH IMPLICIT RETURN
// ============================================
// Arrow function with implicit return (no curly braces)
// Only works for simple components without hooks or logic
const ArrowFunctionImplicit = () => <div>Simple Component</div>;

// ============================================
// 5. WITH React.FC TYPE (TypeScript)
// ============================================
// Explicitly typed with React.FC - provides type checking for props
const WithReactFC: React.FC = () => {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
};

// ============================================
// 6. WITH PROPS (Function Declaration)
// ============================================
interface Props {
  name: string;
  age?: number;
}

function WithPropsFunction({ name, age = 0 }: Props) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}

// ============================================
// 7. WITH PROPS (Arrow Function)
// ============================================
const WithPropsArrow = ({ name, age = 0 }: Props) => {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

// ============================================
// 8. WITH PROPS (React.FC)
// ============================================
// React.FC automatically includes children prop
const WithPropsReactFC: React.FC<Props> = ({ name, age = 0 }) => {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

// ============================================
// 9. WITH CHILDREN (React.FC)
// ============================================
// React.FC includes children automatically
const WithChildren: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

// ============================================
// 10. WITH CHILDREN (Manual Typing)
// ============================================
interface WithChildrenProps {
  title: string;
  children: React.ReactNode;
}

const WithChildrenManual = ({ title, children }: WithChildrenProps) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

// ============================================
// 11. NAMED EXPORT FUNCTION
// ============================================
export function NamedExportFunction() {
  return <div>Named Export</div>;
}

// ============================================
// 12. DEFAULT EXPORT FUNCTION
// ============================================
export default function DefaultExportFunction() {
  return <div>Default Export</div>;
}

// ============================================
// 13. MEMOIZED COMPONENT (Performance)
// ============================================
// React.memo prevents re-renders if props haven't changed
const MemoizedComponent = React.memo(() => {
  const [count, setCount] = useState(0);
  return <div>Memoized Count: {count}</div>;
});

// ============================================
// 14. MEMOIZED WITH PROPS
// ============================================
const MemoizedWithProps = React.memo(({ name }: { name: string }) => {
  return <div>Memoized: {name}</div>;
});

// ============================================
// 15. ASYNC COMPONENT (Not Recommended)
// ============================================
// Note: React components cannot be async directly
// But you can use async functions inside useEffect
const AsyncComponent = () => {
  const [data, setData] = useState<string>('Loading...');
  
  React.useEffect(() => {
    const fetchData = async () => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData('Loaded!');
    };
    fetchData();
  }, []);
  
  return <div>{data}</div>;
};

// ============================================
// USAGE EXAMPLES
// ============================================
export const ComponentExamples = () => {
  return (
    <div>
      <FunctionDeclaration />
      <ArrowFunction />
      <ArrowFunctionExplicit />
      <ArrowFunctionImplicit />
      <WithReactFC />
      <WithPropsFunction name="John" age={25} />
      <WithPropsArrow name="Jane" />
      <WithPropsReactFC name="Bob" age={30} />
      <WithChildren title="My Title">
        <p>This is children content</p>
      </WithChildren>
      <WithChildrenManual title="Manual Typing">
        <p>Children with manual typing</p>
      </WithChildrenManual>
      <MemoizedComponent />
      <MemoizedWithProps name="Memoized Name" />
      <AsyncComponent />
    </div>
  );
};
