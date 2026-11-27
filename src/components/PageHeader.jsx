/* The same opening for every portal page: title, one line of context,
   and the page's main actions on the right. */
const PageHeader = ({ title, subtitle, actions, children }) => (
  <header className="page-head">
    <div className="page-head-text">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}
    </div>
    {actions && <div className="page-actions">{actions}</div>}
    {children && <div className="page-head-extra">{children}</div>}
  </header>
);

export default PageHeader;
