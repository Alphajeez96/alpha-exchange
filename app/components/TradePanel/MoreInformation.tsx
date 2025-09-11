const MoreInformation = () => {
  return (
    <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm">
      <div className="text-xs text-muted mb-2">More Information</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Minimum Received</span>
          <span>1,852 USDT</span>
        </div>

        <div className="flex justify-between">
          <span>Gas Fee</span>
          <span>$16.34</span>
        </div>

        <div className="flex justify-between ease-">
          <span>Price Impact</span>
          <span>&lt; 0.01%</span>
        </div>
      </div>
    </div>
  );
};

export default MoreInformation;
