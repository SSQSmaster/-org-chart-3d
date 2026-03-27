import { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import useOrgStore from './store/useOrgStore';
import { orgData, getDepartmentColor } from './data/orgData';
import './index.css';

function App() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const fgRef = useRef();
  const { selectedNode, setSelectedNode, clearSelectedNode, highlightNodes, setHighlightNodes, clearHighlight } = useOrgStore();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedNode && fgRef.current) {
      fgRef.current.centerAt(selectedNode.x, selectedNode.y, selectedNode.z, 1000);
    }
  }, [selectedNode]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    const connectedNodes = new Set([node.id]);
    orgData.links.forEach(link => {
      if (link.source.id === node.id) connectedNodes.add(link.target.id);
      if (link.target.id === node.id) connectedNodes.add(link.source.id);
    });
    setHighlightNodes(connectedNodes);
  }, [setSelectedNode, setHighlightNodes]);

  const handleBackgroundClick = useCallback(() => {
    clearSelectedNode();
    clearHighlight();
  }, [clearSelectedNode, clearHighlight]);

  const handleNodeThreeObject = useCallback((node) => {
    const isHighlighted = highlightNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const baseRadius = isSelected ? 8 : 6;
    
    const group = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(baseRadius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: getDepartmentColor(node.department),
      transparent: true,
      opacity: isHighlighted || !selectedNode ? 1 : 0.3,
      emissive: isSelected ? 0xffaa00 : 0x222222,
      emissiveIntensity: isSelected ? 0.5 : 0.1,
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);
    
    if (node.avatar) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.avatar, 64, 64);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(16, 16, 1);
      sprite.position.y = 12;
      group.add(sprite);
    }
    
    return group;
  }, [highlightNodes, selectedNode]);

  return (
    <div className="app-container">
      <div className="graph-container" onClick={handleBackgroundClick}>
        <ForceGraph3D
          ref={fgRef}
          graphData={orgData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#1a1a2e"
          nodeLabel="name"
          nodeThreeObject={handleNodeThreeObject}
          onNodeClick={handleNodeClick}
          linkColor={() => '#4a5568'}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => '#718096'}
          d3VelocityDecay={0.3}
          d3AlphaDecay={0.02}
          warmupTicks={100}
          onEngineStop={() => fgRef.current?.zoomToFit(400)}
        />
      </div>

      {selectedNode && (
        <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={handleBackgroundClick}>×</button>
          <div className="panel-header">
            <div className="avatar-large">{selectedNode.avatar}</div>
            <h2>{selectedNode.name}</h2>
            <p className="title">{selectedNode.title}</p>
          </div>
          <div className="panel-content">
            <div className="info-row">
              <span className="label">部门:</span>
              <span className="value" style={{ color: getDepartmentColor(selectedNode.department) }}>
                {selectedNode.department === 'executive' ? '管理层' :
                 selectedNode.department === 'technology' ? '技术部' :
                 selectedNode.department === 'finance' ? '财务部' :
                 selectedNode.department === 'operations' ? '运营部' : '人事部'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value">{selectedNode.id}</span>
            </div>
          </div>
          <div className="panel-footer">
            <p className="hint">拖拽节点可移动 | 滚轮缩放 | 右键旋转</p>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>部门图例</h3>
        <div className="legend-item">
          <span className="color-dot" style={{ background: '#e74c3c' }}></span>
          <span>管理层</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ background: '#3498db' }}></span>
          <span>技术部</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ background: '#27ae60' }}></span>
          <span>财务部</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ background: '#f39c12' }}></span>
          <span>运营部</span>
        </div>
        <div className="legend-item">
          <span className="color-dot" style={{ background: '#9b59b6' }}></span>
          <span>人事部</span>
        </div>
      </div>

      <div className="title-bar">
        <h1>企业组织架构 3D 可视化</h1>
      </div>
    </div>
  );
}

export default App;
