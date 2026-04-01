import React from 'react';

/**
 * Reusable SVG Coordinate Grid with HTML Labels
 */
export const GraphCanvas = ({ 
  width = 400, 
  height = 400, 
  domain = [-10, 10], 
  range = [-10, 10], 
  children
}) => {
  const [minX, maxX] = domain;
  const [minY, maxY] = range;

  const mapX = (x) => ((x - minX) / (maxX - minX)) * width;
  const mapY = (y) => height - ((y - minY) / (maxY - minY)) * height;

  const gridX = [];
  for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
    gridX.push(x);
  }

  const gridY = [];
  for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
    gridY.push(y);
  }

  return (
    <div style={{ position: 'relative', width, height, background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
      {/* SVG Layer for grids and curves */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Background Grid Lines */}
        {gridX.map(x => (
          <line key={`gx-${x}`} x1={mapX(x)} y1={0} x2={mapX(x)} y2={height} stroke="var(--border)" strokeWidth="1" />
        ))}
        {gridY.map(y => (
          <line key={`gy-${y}`} x1={0} y1={mapY(y)} x2={width} y2={mapY(y)} stroke="var(--border)" strokeWidth="1" />
        ))}

        {/* Axes */}
        <line x1={0} y1={mapY(0)} x2={width} y2={mapY(0)} stroke="var(--border2)" strokeWidth="2" />
        <line x1={mapX(0)} y1={0} x2={mapX(0)} y2={height} stroke="var(--border2)" strokeWidth="2" />

        {/* Children SVG Elements (curves, shapes, etc) */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.props.isSvg) {
            return React.cloneElement(child, { mapX, mapY, minX, maxX, minY, maxY, width, height });
          }
          return null;
        })}
      </svg>

      {/* HTML Layer for Labels */}
      {gridX.filter(x => x !== 0 && x % 2 === 0).map(x => (
        <div key={`lx-${x}`} className="math-font" style={{
          position: 'absolute', left: mapX(x), top: mapY(0) + 4, transform: 'translateX(-50%)',
          fontSize: '10px', color: 'var(--text3)'
        }}>
          {x}
        </div>
      ))}
      {gridY.filter(y => y !== 0 && y % 5 === 0).map(y => (
        <div key={`ly-${y}`} className="math-font" style={{
          position: 'absolute', left: mapX(0) - 24, top: mapY(y), transform: 'translateY(-50%)',
          fontSize: '10px', color: 'var(--text3)', width: '20px', textAlign: 'right'
        }}>
          {y}
        </div>
      ))}

      {/* Children HTML Elements (dynamic tooltips, labels) */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.props.isHtml) {
          return React.cloneElement(child, { mapX, mapY });
        }
        return null;
      })}
    </div>
  );
};

export const SvgPath = ({ points = [], fill = 'none', stroke = 'var(--indigo)', strokeWidth = 2, mapX, mapY, isSvg, ...props }) => {
  if (!points.length || !mapX || !mapY) return null;
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} {...props} />;
};

export const SvgCircle = ({ x = 0, y = 0, radius = 5, fill = 'var(--teal)', stroke = 'none', strokeWidth = 1, mapX, mapY, isSvg, ...props }) => {
  if (!mapX || !mapY) return null;
  // Radius calculation depends on domain/range aspect. Here we assume domain/range aspect is proportional, or we just use absolute pixels if it's a small dot.
  // If we need data radius, we map it. Let's assume `radius` is in pixels for points.
  return <circle cx={mapX(x)} cy={mapY(y)} r={radius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} {...props} />;
};

export const HtmlLabel = ({ x, y, children, mapX, mapY, style = {}, isHtml }) => {
  if (!mapX || !mapY) return null;
  return (
    <div style={{ position: 'absolute', left: mapX(x), top: mapY(y), transform: 'translate(-50%, -100%)', ...style }}>
      {children}
    </div>
  );
};
