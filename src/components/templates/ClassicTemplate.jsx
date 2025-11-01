import ModernTemplate from './ModernTemplate';

// For now, use ModernTemplate as base - can be customized later
const ClassicTemplate = ({ resume }) => {
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <ModernTemplate resume={resume} />
    </div>
  );
};

export default ClassicTemplate;
