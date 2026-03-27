import { create } from 'zustand';

const useOrgStore = create((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  clearSelectedNode: () => set({ selectedNode: null }),
  
  highlightNodes: new Set(),
  setHighlightNodes: (nodes) => set({ highlightNodes: nodes }),
  addHighlight: (nodeId) => set((state) => ({
    highlightNodes: new Set([...state.highlightNodes, nodeId])
  })),
  clearHighlight: () => set({ highlightNodes: new Set() }),
  
  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open }),
}));

export default useOrgStore;
