import ContentListEditor from '../components/ContentListEditor';

export default function MarqueePanel() {
  return (
    <div className="dash-body dash-body-single">
      <ContentListEditor
        type="marquee_item"
        itemLabel="Running Teks"
        placeholder="mis. Sistem Payroll + Slip Gaji Digital"
      />
    </div>
  );
}
