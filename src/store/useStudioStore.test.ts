import { describe, it, expect, beforeEach } from 'vitest';
import { useStudioStore } from './useStudioStore';
import { SCARVES } from '../data/scarves';

describe('useStudioStore', () => {
  beforeEach(() => {
    // Reset to pristine initial state
    useStudioStore.setState({
      activeScarfId: 'florave',
      activeScarf: SCARVES['florave'],
      heroMode: 'canvas',
      viewPreset: 'front',
      cursor: { x: 0, y: 0, isHovering: false, intensity: 0 },
      uiHighlight: { active: false, targetId: null, explanation: null },
      isBagOpen: false,
      cart: [],
      isAudioMuted: true,
    });
  });

  it('initializes with florave as default scarf', () => {
    const state = useStudioStore.getState();
    expect(state.activeScarfId).toBe('florave');
    expect(state.activeScarf.name).toBe('Floravé');
    expect(state.viewPreset).toBe('front');
    expect(state.cart).toEqual([]);
    expect(state.isBagOpen).toBe(false);
  });

  it('updates active scarf on selectScarf', () => {
    useStudioStore.getState().selectScarf('sylvea');
    const state = useStudioStore.getState();
    expect(state.activeScarfId).toBe('sylvea');
    expect(state.activeScarf.name).toBe('Sylvéa');
  });

  it('updates 3D view preset on set3DView', () => {
    useStudioStore.getState().set3DView('drape_detail');
    expect(useStudioStore.getState().viewPreset).toBe('drape_detail');
  });

  it('updates cursor coordinates and hover intensity', () => {
    useStudioStore.getState().setCursor({
      x: 0.35,
      y: -0.25,
      isHovering: true,
      intensity: 0.9,
    });
    const { cursor } = useStudioStore.getState();
    expect(cursor.x).toBe(0.35);
    expect(cursor.y).toBe(-0.25);
    expect(cursor.isHovering).toBe(true);
    expect(cursor.intensity).toBe(0.9);
  });

  it('handles shopping bag drawer actions and cart modifications', () => {
    const store = useStudioStore.getState();

    // Add first item
    store.addToBag('florielle', 1);
    let state = useStudioStore.getState();
    expect(state.cart.length).toBe(1);
    expect(state.cart[0].scarfId).toBe('florielle');
    expect(state.cart[0].quantity).toBe(1);
    expect(state.cart[0].price).toBe(SCARVES['florielle'].price);
    expect(state.isBagOpen).toBe(true);

    // Add same item again -> increments quantity
    store.addToBag('florielle', 2);
    state = useStudioStore.getState();
    expect(state.cart.length).toBe(1);
    expect(state.cart[0].quantity).toBe(3);

    // Update quantity
    store.updateBagQuantity('florielle', 4);
    expect(useStudioStore.getState().cart[0].quantity).toBe(4);

    // Remove item
    store.removeFromBag('florielle');
    expect(useStudioStore.getState().cart.length).toBe(0);
  });

  it('controls UI spotlight highlight triggers for Orchéllia', () => {
    const store = useStudioStore.getState();
    store.highlightUI('craft-steamer', 'Detailed botanical steam extraction chamber');

    let state = useStudioStore.getState();
    expect(state.uiHighlight.active).toBe(true);
    expect(state.uiHighlight.targetId).toBe('craft-steamer');
    expect(state.uiHighlight.explanation).toContain('botanical steam');

    store.clearUIHighlight();
    state = useStudioStore.getState();
    expect(state.uiHighlight.active).toBe(false);
    expect(state.uiHighlight.targetId).toBeNull();
  });

  it('controls UI zoom in and out levels for Orchéllia inspection', () => {
    const store = useStudioStore.getState();
    expect(store.zoomState.isZoomed).toBe(false);
    expect(store.zoomState.level).toBe(1.0);

    store.setZoom('3d_scarf', 2.0);
    let state = useStudioStore.getState();
    expect(state.zoomState.isZoomed).toBe(true);
    expect(state.zoomState.target).toBe('3d_scarf');
    expect(state.zoomState.level).toBe(2.0);

    store.resetZoom();
    state = useStudioStore.getState();
    expect(state.zoomState.isZoomed).toBe(false);
    expect(state.zoomState.target).toBeNull();
    expect(state.zoomState.level).toBe(1.0);
  });

  it('toggles and sets ambient audio mute status', () => {
    const store = useStudioStore.getState();
    expect(store.isAudioMuted).toBe(true);

    store.toggleAudio();
    expect(useStudioStore.getState().isAudioMuted).toBe(false);

    store.setAudioMuted(true);
    expect(useStudioStore.getState().isAudioMuted).toBe(true);
  });

  it('manages settings drawer state and user profile preferences', () => {
    const store = useStudioStore.getState();
    expect(store.isSettingsOpen).toBe(false);
    expect(store.settings.username).toBe('OrchineVisitor');

    store.openSettings();
    expect(useStudioStore.getState().isSettingsOpen).toBe(true);

    store.updateSettings({ username: 'AlexDyer', theme: 'light' });
    const updated = useStudioStore.getState().settings;
    expect(updated.username).toBe('AlexDyer');
    expect(updated.theme).toBe('light');

    store.closeSettings();
    expect(useStudioStore.getState().isSettingsOpen).toBe(false);
  });

  it('manages about us team modal and member details', () => {
    const store = useStudioStore.getState();
    expect(store.isAboutOpen).toBe(false);
    expect(store.teamMembers.length).toBe(4);

    store.openAbout();
    expect(useStudioStore.getState().isAboutOpen).toBe(true);

    store.updateTeamMember('member-1', { name: 'Elena Vance', instagram: '@elena.vance' });
    const member1 = useStudioStore.getState().teamMembers.find((m) => m.id === 'member-1');
    expect(member1?.name).toBe('Elena Vance');
    expect(member1?.instagram).toBe('@elena.vance');

    store.updateClassLogo('/custom-logo.png');
    expect(useStudioStore.getState().classLogo).toBe('/custom-logo.png');

    store.closeAbout();
    expect(useStudioStore.getState().isAboutOpen).toBe(false);
  });

  it('manages digital eco-passport signature card state and sequential minting from #0000', () => {
    useStudioStore.setState({
      isEcoPassportOpen: false,
      activePassportData: null,
      passportCounter: 0,
      mintedPassports: [],
      hasHydratedPassports: true,
    });
    const store = useStudioStore.getState();
    expect(store.isEcoPassportOpen).toBe(false);
    expect(store.activePassportData).toBeNull();

    // Open with default signature card values (#0000)
    store.openEcoPassport();
    expect(useStudioStore.getState().isEcoPassportOpen).toBe(true);
    expect(useStudioStore.getState().activePassportData?.batchNumber).toBe('#0000');
    expect(useStudioStore.getState().activePassportData?.orderId).toBe('ORCH-2026-X84K');

    // Sequential minting starting from #0000 -> #0001 -> #0002
    const first = useStudioStore.getState().mintEcoPassport({
      orderId: 'ORC-100001',
      recipientName: 'Claire Redfield',
      scarfName: 'Solstice',
    });
    expect(first.batchNumber).toBe('#0000');
    expect(useStudioStore.getState().passportCounter).toBe(1);

    const second = useStudioStore.getState().mintEcoPassport({
      orderId: 'ORC-100002',
      recipientName: 'Ada Wong',
      scarfName: 'Indigo Flora',
    });
    expect(second.batchNumber).toBe('#0001');
    expect(useStudioStore.getState().passportCounter).toBe(2);
    expect(useStudioStore.getState().mintedPassports).toHaveLength(2);
    expect(useStudioStore.getState().activePassportData?.batchNumber).toBe('#0001');

    // Switch back to an earlier minted edition
    useStudioStore.getState().selectPassportEdition('#0000');
    expect(useStudioStore.getState().activePassportData?.batchNumber).toBe('#0000');
    expect(useStudioStore.getState().activePassportData?.recipientName).toBe('Claire Redfield');

    // Toggle and Close
    useStudioStore.getState().toggleEcoPassport();
    expect(useStudioStore.getState().isEcoPassportOpen).toBe(false);

    useStudioStore.getState().openEcoPassport();
    expect(useStudioStore.getState().isEcoPassportOpen).toBe(true);

    useStudioStore.getState().closeEcoPassport();
    expect(useStudioStore.getState().isEcoPassportOpen).toBe(false);
  });
});
