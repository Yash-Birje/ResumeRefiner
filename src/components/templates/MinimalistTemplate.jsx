import ModernTemplate from './ModernTemplate';

// For now, use ModernTemplate as base - can be customized later
const MinimalistTemplate = ({ resume }) => {
  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <ModernTemplate resume={resume} />
    </div>
  );
};

export default MinimalistTemplate;
